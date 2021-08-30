# frozen_string_literal: true

require 'faraday'
require 'json'

class FetchPlaces
  SEARCH_URL    = 'https://api.yelp.com/v3/businesses/search'

  ApiError = Class.new(StandardError)

  def initialize(user)
    @user   = user
    @query  = user.search&.query
    @offset = user.search&.current_offset&.value || 0

    raise ArgumentError, "User does not have any query" unless @query
  end

  def call
    fetch_places.tap do
      @user.search&.upsert_offset(@offset)
    end
  end

  protected

  def fetch_places # rubocop:disable Metrics/AbcSize
    acc = []

    while acc.empty?
      response = client.get(SEARCH_URL, query.compact.merge(offset: @offset))

      if response.key?('error')
        raise ApiError, response.dig('error', 'description') || 'Unknown error'
      elsif response.fetch('businesses').empty?
        break
      else
        acc += response.fetch('businesses').reject do |place|
          pp place.fetch('id')

          used_place_ids.include?(place.fetch('id'))
        end
      end

      @offset += response.fetch('businesses').length
    end

    acc.uniq
  end

  def used_place_ids
    @used_place_ids ||= @user.discarded_place_ids + @user.kept_place_ids
  end

  def query
    query = {
      longitude: @query.fetch("longitude"),
      latitude:  @query.fetch("latitude"),
      open_now:  @query["open"],
      term:      @query["restaurants"],
    }

    query[:attributes] = "hot_and_new" if @query["hot"]
    query[:price]      = @query["price"].to_i.times.map(&:next).join(",").presence

    query
  end

  def client
    YelpClient.new(ENV['YELP_API_KEY'])
  end
end
