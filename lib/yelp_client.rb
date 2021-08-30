# frozen_string_literal: true

class YelpClient
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
