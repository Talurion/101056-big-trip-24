import { render, replace, remove } from '../framework/render.js';
import { isEscapeKey } from '../utils/common.js';
import NewEventsItemView from '../view/new-events-item-view.js';
import NewEventEditElementView from '../view/new-event-edit-element-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class EventPresenter {
  #container = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #findDestinationData = null;
  #getDestinationsList = null;
  #getOffersMapByType = null;

  #eventComponent = null;
  #eventEditComponent = null;

  #eventItem = null;
  #mode = Mode.DEFAULT;

  constructor ({container, onDataChange, onModeChange, findDestinationData, getDestinationsList, getOffersMapByType}) {
    this.#container = container;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#findDestinationData = findDestinationData;
    this.#getDestinationsList = getDestinationsList;
    this.#getOffersMapByType = getOffersMapByType;
  }

  init (eventItem) {
    this.#eventItem = eventItem;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new NewEventsItemView({
      userEvent: this.#eventItem,
      onClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });
    this.#eventEditComponent = new NewEventEditElementView({
      userEvent: this.#eventItem,
      onClick: this.#handleSaveClick,
      findDestination: this.#findDestinationData,
      getDestinationsData: this.#getDestinationsList,
      getOffersMapByType: this.#getOffersMapByType,
    });

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace (this.#eventComponent, prevEventComponent);
    }
    if (this.#mode === Mode.EDITING) {
      replace (this.#eventEditComponent, prevEventEditComponent);
    }
    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  #replaceEventCardToEditForm() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditFormToEventCard() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#eventEditComponent.reset(this.#eventItem);
      this.#replaceEditFormToEventCard();
    }
  }

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#replaceEditFormToEventCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceEventCardToEditForm();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#eventItem, isFavorite: !this.#eventItem.isFavorite});
  };

  #handleSaveClick = (eventItem) => {
    this.#handleDataChange(eventItem);
    this.#replaceEditFormToEventCard();
  };

}
