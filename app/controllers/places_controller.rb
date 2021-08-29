# frozen_string_literal: true

class PlacesController < ApplicationController
  def index
    render json: {ok: true, places: fetch_places}
  rescue FetchPlaces::ApiError => e
    render json: {ok: false, error: e.message}
  end

  protected

  def fetch_places
    FetchPlaces.new(current_user).call
  end
end
