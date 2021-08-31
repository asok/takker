# frozen_string_literal: true

module AppendingPlace
  def self.mixin(association_name)
    Module.new do
      def initialize(user)
        @user = user
      end

      # define_method instead of def since we need to capture
      # association_name variable.
      define_method :call do |place|
        @user.public_send(association_name).push(place)
      end
    end
  end
end
