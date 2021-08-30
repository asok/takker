Rails.application.routes.draw do
  devise_for :users
  devise_scope :user do
    get '/sign_out', to: 'devise/sessions#destroy', as: :signout
  end

  resources :searches,         only: [:create]
  resources :places,           only: [:index]
  resources :discarded_places, only: [:create]
  resources :kept_places,      only: [:create, :index]

  root 'home#index'
end
