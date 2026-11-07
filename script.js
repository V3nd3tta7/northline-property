const properties = [
  {
    id: 'cedar-house',
    name: 'The Cedar House',
    area: 'Hampstead',
    price: 1480000,
    bedrooms: 4,
    bathrooms: 3,
    areaSqm: 186,
    type: 'House',
    image: 'assets/property-1.jpg',
    imagePosition: 'center 52%',
    description: 'A quietly composed family home with generous, light-filled rooms and a garden imagined for slow Sunday mornings.'
  },
  {
    id: 'the-courtyard',
    name: 'The Courtyard',
    area: 'Islington',
    price: 785000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqm: 94,
    type: 'Apartment',
    image: 'assets/property-2.jpg',
    imagePosition: 'center 45%',
    description: 'A considered apartment with a calm courtyard outlook, thoughtful proportions and room to make your own.'
  },
  {
    id: 'willow-mews',
    name: 'Willow Mews',
    area: 'Wandsworth',
    price: 925000,
    bedrooms: 3,
    bathrooms: 2,
    areaSqm: 128,
    type: 'House',
    image: 'assets/property-3.jpg',
    imagePosition: 'center 42%',
    description: 'A welcoming mews home pairing a practical layout with soft natural light and a little breathing room.'
  },
  {
    id: 'the-lightwell',
    name: 'The Lightwell',
    area: 'Clerkenwell',
    price: 575000,
    bedrooms: 1,
    bathrooms: 1,
    areaSqm: 67,
    type: 'Apartment',
    image: 'assets/property-4.jpg',
    imagePosition: 'center 45%',
    description: 'An intimate city apartment made memorable by its open plan, considered details and lovely afternoon light.'
  },
  {
    id: 'maple-residence',
    name: 'Maple Residence',
    area: 'Richmond',
    price: 1595000,
    bedrooms: 4,
    bathrooms: 3,
    areaSqm: 212,
    type: 'House',
    image: 'assets/property-5.jpg',
    imagePosition: 'center 52%',
    description: 'A generous imagined family residence where relaxed living spaces meet a leafy, neighbourhood feel.'
  },
  {
    id: 'park-view',
    name: 'Park View',
    area: 'Battersea',
    price: 1125000,
    bedrooms: 3,
    bathrooms: 2,
    areaSqm: 142,
    type: 'Apartment',
    image: 'assets/property-6.jpg',
    imagePosition: 'center 44%',
    description: 'A spacious apartment with an easy flow between living spaces and a fictional outlook over green London.'
  }
];

const filterForm = document.querySelector('#property-filters');
const propertyGrid = document.querySelector('#property-grid');
const resultsCount = document.querySelector('#results-count');
const emptyState = document.querySelector('#empty-state');
const propertyDialog = document.querySelector('#property-dialog');
const dialogPhoto = document.querySelector('#dialog-photo');
const heroPhoto = document.querySelector('.hero-art img');
const menuToggle = document.querySelector('.menu-toggle');
const primaryNavigation = document.querySelector('#primary-navigation');
const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0
});

heroPhoto.addEventListener('error', () => heroPhoto.remove(), { once: true });

function formatPrice(price) {
  return currencyFormatter.format(price).replace(/\u00a0/g, '\u00a0');
}

function createPropertyCard(property) {
  const article = document.createElement('article');
  article.className = 'property-card';

  const button = document.createElement('button');
  button.className = 'property-card-button';
  button.type = 'button';
  button.setAttribute('aria-label', `View details for ${property.name}, ${property.area}`);

  const image = document.createElement('div');
  image.className = 'property-art';
  image.setAttribute('aria-hidden', 'true');
  const photo = document.createElement('img');
  photo.src = property.image;
  photo.alt = '';
  photo.loading = 'lazy';
  photo.decoding = 'async';
  photo.style.objectPosition = property.imagePosition;
  photo.addEventListener('error', () => photo.remove(), { once: true });
  const badge = document.createElement('span');
  badge.className = 'illustrative-badge';
  badge.textContent = 'Illustrative listing';
  image.append(photo, badge);

  const info = document.createElement('div');
  info.className = 'property-info';
  const location = document.createElement('p');
  location.className = 'property-location';
  location.textContent = `${property.area}, London`;
  const title = document.createElement('h3');
  title.className = 'property-title';
  title.textContent = property.name;
  const price = document.createElement('p');
  price.className = 'property-price';
  price.textContent = formatPrice(property.price);
  const specs = document.createElement('ul');
  specs.className = 'property-specs';
  [
    `${property.bedrooms} ${property.bedrooms === 1 ? 'bedroom' : 'bedrooms'}`,
    `${property.bathrooms} ${property.bathrooms === 1 ? 'bathroom' : 'bathrooms'}`,
    `${property.areaSqm} m²`
  ].forEach((detail) => {
    const item = document.createElement('li');
    item.textContent = detail;
    specs.append(item);
  });
  const type = document.createElement('span');
  type.className = 'property-type-label';
  type.textContent = property.type;

  info.append(location, title, price, specs, type);
  button.append(image, info);
  button.addEventListener('click', () => openPropertyDetails(property));
  article.append(button);
  return article;
}

function getFilteredProperties() {
  const selectedType = filterForm.elements.type.value;
  const minimumBedrooms = Number(filterForm.elements.bedrooms.value);
  const maximumPrice = Number(filterForm.elements.price.value);

  return properties.filter((property) => {
    const matchesType = selectedType === 'all' || property.type === selectedType;
    const matchesBedrooms = property.bedrooms >= minimumBedrooms;
    const matchesPrice = maximumPrice === 0 || property.price <= maximumPrice;
    return matchesType && matchesBedrooms && matchesPrice;
  });
}

function renderProperties() {
  const filteredProperties = getFilteredProperties();
  propertyGrid.replaceChildren(...filteredProperties.map(createPropertyCard));
  resultsCount.textContent = `${filteredProperties.length} ${filteredProperties.length === 1 ? 'home' : 'homes'} to explore`;
  emptyState.hidden = filteredProperties.length > 0;
  propertyGrid.hidden = filteredProperties.length === 0;
}

function openPropertyDetails(property) {
  document.querySelector('#dialog-location').textContent = `${property.area}, London`;
  document.querySelector('#dialog-title').textContent = property.name;
  document.querySelector('#dialog-price').textContent = formatPrice(property.price);
  document.querySelector('#dialog-description').textContent = property.description;
  dialogPhoto.src = property.image;
  dialogPhoto.alt = '';
  dialogPhoto.hidden = false;
  dialogPhoto.style.objectPosition = property.imagePosition;
  dialogPhoto.onerror = () => {
    dialogPhoto.hidden = true;
  };

  const specList = document.querySelector('#dialog-specs');
  specList.replaceChildren();
  [
    property.type,
    `${property.bedrooms} ${property.bedrooms === 1 ? 'bedroom' : 'bedrooms'}`,
    `${property.bathrooms} ${property.bathrooms === 1 ? 'bathroom' : 'bathrooms'}`,
    `${property.areaSqm} m²`
  ].forEach((detail) => {
    const item = document.createElement('li');
    item.textContent = detail;
    specList.append(item);
  });

  propertyDialog.showModal();
}

filterForm.addEventListener('change', renderProperties);
filterForm.addEventListener('reset', () => {
  requestAnimationFrame(renderProperties);
});
document.querySelector('.dialog-close').addEventListener('click', () => propertyDialog.close());
propertyDialog.addEventListener('click', (event) => {
  if (event.target === propertyDialog) propertyDialog.close();
});

menuToggle.addEventListener('click', () => {
  const isExpanded = primaryNavigation.classList.contains('is-open');
  menuToggle.setAttribute('aria-expanded', String(!isExpanded));
  primaryNavigation.classList.toggle('is-open', !isExpanded);
});
primaryNavigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    menuToggle.setAttribute('aria-expanded', 'false');
    primaryNavigation.classList.remove('is-open');
  }
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 680 && primaryNavigation.classList.contains('is-open')) {
    menuToggle.setAttribute('aria-expanded', 'false');
    primaryNavigation.classList.remove('is-open');
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;

  if (propertyDialog.open) {
    propertyDialog.close();
    return;
  }

  if (primaryNavigation.classList.contains('is-open')) {
    menuToggle.setAttribute('aria-expanded', 'false');
    primaryNavigation.classList.remove('is-open');
  }
});
document.querySelector('#current-year').textContent = new Date().getFullYear();

renderProperties();
