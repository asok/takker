Rails.application.routes.draw do
  devise_for :users

  resources :searches,         only: [:create]
  resources :places,           only: [:index]
  resources :discarded_places, only: [:create]
  resources :kept_places,      only: [:create]

  root 'home#index'
end
