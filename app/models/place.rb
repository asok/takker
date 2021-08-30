# frozen_string_literal: true

class Place
  include Mongoid::Document

  field :id,        type: String
  field :address1,  type: String
  field :address2,  type: String
  field :address3,  type: String
  field :image_url, type: String
  field :name,      type: String
  field :rating,    type: Integer
  field :phone,     type: String
  field :price,     type: String

  embeds_one :location

  class Location
    include Mongoid::Document

    field :address1, type: String
    field :address2, type: String
    field :address3, type: String
    field :zip_code, type: String
    field :city,     type: String
    field :state,    type: String
    field :country,  type: String

    embedded_in :place
  end
end
