# frozen_string_literal: true

require 'rails_helper'

RSpec.describe FetchPlaces do
  describe "#call" do
    subject { described_class.new(user) }

    let!(:user) do
      User.create!(
        email:                 'foo@takker.com',
        password:              'takker123',
        password_confirmation: 'takker123',
        search:                search
      )
    end
    let(:search) do
      Search.new(
        query: {
          'latitude'  => '37.767413217936834',
          'longitude' => '-122.42820739746094',
          'open'      => true,
          'hot'       => true
        }
      )
    end

    it "returns search results" do
      VCR.use_cassette("search_green") do
        place1, *rest = subject.call

        expect(rest.length).to eq(11)

        expect(place1).to include('id' => 'vmwLmMvOK-JB2uT3Cqinyw')
      end
    end

    context '1 places was already discarded' do
      let(:place) { Place.new(id: 'vmwLmMvOK-JB2uT3Cqinyw') }

      before { user.discarded_places << place }

      it 'does not return it' do
        VCR.use_cassette("search_green") do
          place1, *rest = subject.call

          expect(rest.length).to eq(10)

          expect(place1).to include('id' => be_present)
        end
      end
    end

    context 'some error encountered' do
      it "raises error" do
        VCR.use_cassette("search_red") do
          expect {
            subject.call
          }.to raise_error(FetchPlaces::ApiError)
        end
      end
    end
  end
end
