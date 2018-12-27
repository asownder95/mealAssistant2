const { Permission, Suggestions } = require('actions-on-google');

const askNamePermission = (conv) => {
  const name = conv.user.storage.name;
  if (!name) {
    conv.ask(new Permission({
      context: 'Welcome to Meal Assistant! To provide you a personalized experience',
      permissions: 'NAME',
    }));
  } else {
    conv.ask(`Good to hear from you again ${name.given}! What would you like to do today?`);
  }
};

const askInitialIntent = (conv, params, permissionGranted) => {
  if (!permissionGranted) {
    conv.ask('Okay, no worries. What would you like to do today?');
    conv.ask(new Suggestions('Search Recipes'));
  } else {
    conv.user.storage.name = conv.user.name;
    conv.ask(`Thanks ${conv.user.storage.name.given}! What would you like to do today?`);
    conv.ask(new Suggestions('Search Recipes'));
  }
};

const confirmRecipeQuery = (conv, { food, dietaryRestriction }) => {
  const intolerances = new Set(['dairy', 'egg', 'gluten', 'peanut', 'sesame', 'seafood', 'shellfish', 'soy', 'tree nuts', 'wheat']);
  const restrictions = {
    diet: [],
    intolerances: [],
  };
  dietaryRestriction.forEach((item) => {
    if (item === 'vegetarian' || item === 'vegan') {
      restrictions.diet.push(item);
    } else if (intolerances.has(item)) {
      restrictions.intolerances.push(item);
    }
  });
  conv.data.restrictions = restrictions;
  restrictions.diet = restrictions.diet.join(', ');
  restrictions.intolerances = restrictions.intolerances.join(', ');
  const responseDietSection = restrictions.diet.length ? `${restrictions.diet} ${food}` : `${food}`;
  const responseIntolerancesSection = restrictions.intolerances.length ? `without ${restrictions.intolerances} right?` : 'right?';
  conv.ask(`Just to confirm, you wanted to look for ${responseDietSection} recipes ${responseIntolerancesSection}`);
};

module.exports = {
  askNamePermission,
  askInitialIntent,
  confirmRecipeQuery,
};
