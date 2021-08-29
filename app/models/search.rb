# frozen_string_literal: true

class Search
  include Mongoid::Document

  field :query, type: Hash

  belongs_to :user
end
