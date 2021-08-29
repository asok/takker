# frozen_string_literal: true

class SearchesController < ApplicationController
  def create
    current_user.search       ||= Search.new
    current_user.search.query ||= {}

    current_user.search.query.merge!(search_params)
    current_user.search.save!

    render json: {ok: true}
  end

  def search_params
    params.require(:query).permit(
      :longitude,
      :latitude,
      :open,
      :hot,
      :price
    )
  end
end
