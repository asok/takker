# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Searches", type: :request do
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

  before do
    post '/users/sign_in', params: {user: {email: user.email, password: user.password}}
  end

  describe 'POST create' do
    context 'the search does not exist' do
      let!(:search) do
        Search.new(query: {'hot' => false, 'open' => true}).tap do |search|
          user.update!(search: search)
        end
      end

      it "creates a new one" do
        post "/searches", params: {query: {hot: true}}.to_json, headers: headers

        expect(user.search.query).to eq({'hot' => false, 'open' => true})
      end
    end

    context 'the search does exist' do
      it "updates the existing one" do
        post "/searches", params: {query: {hot: true}}.to_json, headers: headers

        expect(user.reload.search.query).to eq({'hot' => true})
      end
    end
  end
end
