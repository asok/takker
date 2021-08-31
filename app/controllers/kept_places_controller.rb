# frozen_string_literal: true

class KeptPlacesController < ApplicationController
  include PlaceParams

  def index
    render json: {ok: true, places: current_user.kept_places}
  end

  def create
    KeepPlace.new(current_user).call(place)

    render json: {ok: true}
  end
end
