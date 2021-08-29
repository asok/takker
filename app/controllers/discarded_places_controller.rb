# frozen_string_literal: true

class DiscardedPlacesController < ApplicationController
  include PlaceParams

  def create
    current_user.discarded_places ||= []
    current_user.discarded_places.push(place)

    render json: {ok: true}
  end
end
