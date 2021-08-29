# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Discarded places", type: :request do
  let!(:user) do
    User.create!(
      email:                 'foo@takker.com',
      password:              'takker123',
      password_confirmation: 'takker123'
    )
  end
  let(:headers) do
    {
      'Content-Type' => 'application/json'
    }
  end
  let(:place) do
    Place.create!(id: 'abc')
  end

  before do
    post '/users/sign_in', params: {user: {email: user.email, password: user.password}}

    user.discarded_places.push(place)
  end

  describe 'POST create' do
    it "creates and adds place to discarded_places" do
      post "/discarded_places",
          params:  {place: {'id' => 'xyz', 'name' => 'foo'}}.to_json,
          headers: headers

      place1, place2, *rest = user.reload.discarded_places
      expect(rest).to be_empty

      expect(place1)
        .to have_attributes(id: 'abc')
      expect(place2)
        .to have_attributes(id: 'xyz')
    end
  end
end
