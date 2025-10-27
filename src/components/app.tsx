import { useState } from "react";

import storage from "../storage";
import { getISODate, getRandomId } from "../utilities";

import type {
  CardBaseData,
  CardExtendedData,
  CardListState,
  ModalState,
} from "./app.types";
import Board from "./board";
import ExportSection from "./exportSection";
import ImportSection from "./importSection";
import CardModal from "./cardModal";
import ThemeSelector from "./themeSelector";
import NewCardButton from "./newCardButton";

interface AppProps {
  initialCategories: string[];
  initialCards: CardListState;
  handleThemeChange: () => void;
}

export default function App({
  initialCategories,
  initialCards,
  handleThemeChange,
}: AppProps) {
  const intiialModalState: ModalState = { type: "new" };
  const [modalState, setModalState] = useState(intiialModalState);

  const [categories, setCategories] = useState(initialCategories);
  const [cards, setCards] = useState(initialCards);
  const [lastChangedBoard, setLastChangedBoard] = useState(getISODate());

  function storeCards(newCards: CardListState) {
    const success = storage.board.entries.set(newCards);
    if (success) {
      // set default modal state to avoid using data of cards
      // that are not part of the board anymore
      setModalState({ type: "new" });

      setCards(newCards);
      setLastChangedBoard(getISODate());
    } else {
      throw new Error("Issue storing cards locally");
    }
  }

  function addCard(cardData: CardBaseData) {
    const newCard = {
      categoryIdx: 0,
      title: cardData.title,
      description: cardData.description,
      category: cardData.category,
      id: getRandomId(),
    };

    const newCards = [...cards, newCard];
    storeCards(newCards);
  }

  function replaceCardList(cardDataList: CardBaseData[]) {
    const newCards = cardDataList.map((cardData) => ({
      categoryIdx: 0,
      title: cardData.title,
      description: cardData.description,
      category: cardData.category,
      id: getRandomId(),
    }));

    storeCards(newCards);
  }

  function updateCard(cardData: CardExtendedData) {
    const newCards = [...cards];
    const cardIndex = newCards.findIndex((card) => card.id === cardData.id);

    const updatedCard = cards[cardIndex];
    updatedCard.title = cardData.title;
    updatedCard.description = cardData.description;
    updatedCard.category = cardData.category;

    newCards[cardIndex] = updatedCard;
    storeCards(newCards);
  }

  function deleteCard(id: string) {
    const newCards = cards.filter((card) => card.id !== id);
    storeCards(newCards);
  }

  return (
    <>
      <header>
        <NewCardButton {...{ setModalState }} />
      </header>
      <Board
        {...{ categories, cards }}
        handlers={{ deleteCard, updateCard, setModalState }}
      />
      <CardModal
        {...{ modalState, categories, cards }}
        handlers={{ addCard, updateCard }}
      />
      <footer>
        <ImportSection {...{ setCategories, replaceCardList }} />
        <ExportSection {...{ lastChangedBoard }} />
        <ThemeSelector {...{ handleThemeChange }} />
      </footer>
    </>
  );
}
