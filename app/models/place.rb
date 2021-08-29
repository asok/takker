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
end
