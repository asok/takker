# frozen_string_literal: true

class DiscardedPlacesController < ApplicationController
  include PlaceParams

  def create
    DiscardPlace.new(current_user).call(place)

    render json: {ok: true}
  end
end
