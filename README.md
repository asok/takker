# Takker

Tinder for Takko https://takker.herokuapp.com/

## Development

```sh
export YELP_API_KEY='your key'
bundle install
bundle exec rails s
```

In other shell process do:

```sh
open localhost:3000
```

## Tests

```sh
bundle exec rspec
```

## Features

### Synopsis

The app uses YELP API to get restuarants in the user's area. Once restaurant is shown user can either keep it or move to the next one. When restaurant was kept it can be browsed in the "Saved restaurants". When user moves to the next restaurant it won't be shown again.

### Implementation

The app requires authentication. It is done using devise gem. No email confirmation needed.
After authentication the app renders a React component. The component allows to search and browse restaurants. At the beginning a search wizard is displayed where user can choose the search preferences. The preferences are stored and can be later changed using a menu that slides in when clicked on the hamburger icon.

You can read more details on chosen technologies via:
```sh
git log --pretty="%ai%n%s%n%n%b%n-----------------------------------------------------------%n"
```

### Limitations

Because of the time limitation there are some shortcuts I've taken:
* sing up/sign in is done via the default devise views - no react components for that
* I only display the basic data on restaurants
* the search is not quite what it should be. For boolean "open" and "hot" filters they can only be either true/false not "doesn't matter"
* the react app should have a proper router, so it's possible to visit each of the components via url (like "saved restaurants")
* after keeping and moving forward I add the whole restaurant json to the db. That's not the most optimal db space wise
* no proper network errors handling
* no full test coverages
* let's just say that it is not the best looking app on the net :)
