# frozen_string_literal: true

require 'faraday'
require 'json'

class FetchPlaces
  SEARCH_URL = 'https://api.yelp.com/v3/businesses/search'

  ApiError = Class.new(StandardError)

  def initialize(user)
    @user   = user
    @query  = user.search&.query
    @offset = 0

    raise ArgumentError, "User does not have any query" unless @query
  end

  def call # rubocop:disable Metrics/AbcSize
    acc = []

    while acc.empty?
      response = client.get(SEARCH_URL, query.compact.merge(offset: @offset))

      if response.key?('error')
        raise ApiError, response.dig('error', 'description') || 'Unknown error'
      elsif response.fetch('total').zero?
        break
      else
        acc += response.fetch('businesses').reject do |place|
          @user.discarded_place_ids.include?(place.fetch('id')) ||
            @user.kept_place_ids.include?(place.fetch('id'))
        end
      end

      @offset += 1
    end

    acc
  end

  protected

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
    Client.new(ENV['YELP_API_KEY'])
  end

  class Client
    def initialize(api_key)
      @api_key = api_key ||
                 raise(ArgumentError, "Set YELP_API_KEY as environmental variable for this process")
    end

    def get(url, query)
      response = Faraday.get(url, query, headers)

      JSON.parse(response.body)
    end

    protected

    def headers
      {
        'Authorization' => "Bearer #{@api_key}",
        'Accept'        => 'application/json',
      }
    end
  end
end
