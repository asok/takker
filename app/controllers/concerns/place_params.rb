# frozen_string_literal: true

module PlaceParams
  protected

  def place_params
    params.require(:place).permit(
      :id,
      :address1,
      :address2,
      :address3,
      :image_url,
      :name,
      :rating,
      :price,
      :phone
    )
  end

  def place
    Place.find(place_params[:id]) || build_place
  end

  def build_place
    Place.new(place_params)
  end
end
