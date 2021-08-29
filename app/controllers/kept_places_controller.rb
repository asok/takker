# frozen_string_literal: true

class KeptPlacesController < ApplicationController
  include PlaceParams

  def create
    current_user.kept_places ||= []
    current_user.kept_places.push(place)

    render json: {ok: true}
  end
end
