import { render } from './framework/render.js';
import EventsModel from './model/events-model.js';
import FilterModel from './model/filter-model.js';
import NewTripInfoView from './view/new-trip-info-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewAddEventButtonView from './view/new-add-event-button-view.js';


const tripMainContainer = document.querySelector('.trip-main');
const tripFiltersContainer = tripMainContainer.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const eventsModel = new EventsModel();
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter({
  container: tripEventsContainer,
  eventsModel,
  filterModel,
  onNewEventDestroy: handleNewEventFormClose,
});
const filterPresenter = new FilterPresenter({
  filterContainer: tripFiltersContainer,
  filterModel,
  eventsModel
});

const newEventButtonComponent = new NewAddEventButtonView({
  onClick: handleNewEventButtonClick
});

function handleNewEventFormClose() {
  newEventButtonComponent.element.disabled = false;
}

function handleNewEventButtonClick() {
  boardPresenter.createEvent();
  newEventButtonComponent.element.disabled = true;
}


render (new NewTripInfoView(), tripMainContainer, 'AFTERBEGIN');
render(newEventButtonComponent, tripMainContainer);

filterPresenter.init();
boardPresenter.init();

