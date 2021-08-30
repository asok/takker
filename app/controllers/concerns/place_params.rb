# frozen_string_literal: true

module PlaceParams
  protected

  def place_params
    params.require(:place).permit(
      :id,
      :image_url,
      :name,
      :rating,
      :price,
      :phone,
      location: [
        :address1,
        :address2,
        :address3,
        :zip_code,
        :city,
        :state,
        :country,
      ]
    )
  end

  def place
    Place.find(place_params[:id]) || build_place
  end

  def build_place
    Place.new(place_params)
  end
end
