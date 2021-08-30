# frozen_string_literal: true

require 'digest/sha1'

class Search
  include Mongoid::Document

  field :query, type: Hash

  belongs_to :user
  has_many :search_offsets

  def digest
    Digest::SHA1.hexdigest((query || {}).sort.to_h.to_json)
  end

  def current_offset
    search_offsets.find_or_initialize_by(search_digest: digest)
  end

  def upsert_offset(value)
    search_offset = current_offset

    search_offset.value = value
    search_offset.save!
  end
end
