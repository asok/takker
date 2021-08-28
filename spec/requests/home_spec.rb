# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Home page", :type => :request do
  it "renders TakkerApp component" do
    get "/"

    expect(response.body).to include('<div data-react-class="TakkerApp')
  end
end
