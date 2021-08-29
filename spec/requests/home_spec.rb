# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Home page", type: :request do
  context "not signed in" do
    it "redirects to sign in page" do
      get "/"

      expect(response).to redirect_to('/users/sign_in')
    end
  end

  context "signed in" do
    let!(:user) do
      User.create!(
        email:                 'foo@takker.com',
        password:              'takker123',
        password_confirmation: 'takker123'
      )
    end

    before do
      post '/users/sign_in', params: {user: {email: user.email, password: user.password}}
    end

    it "renders TakkerApp component" do
      get "/"

      expect(response.body).to include('<div data-react-class="TakkerApp')
    end
  end
end
