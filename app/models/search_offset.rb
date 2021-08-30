# frozen_string_literal: true

class SearchOffset
  include Mongoid::Document

  field :value,         type: Integer
  field :search_digest, type: String

  belongs_to :search
end
