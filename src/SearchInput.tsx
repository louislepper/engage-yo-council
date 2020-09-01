import React, { FunctionComponent, useState, useEffect } from "react";
import { Modal } from './modal';
import { ConfirmationModal } from './confirmation-modal';
import { useModal } from './useModal';

const suggestedSearches = ["Cycle", "Park", "Zoning", "Traffic"];

type SearchInputProps = {
  onSearchTermUpdated: (term: string) => void;
};

export const SearchInput: FunctionComponent<SearchInputProps> = ({ onSearchTermUpdated }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { isShown, toggle } = useModal();
  const onConfirm = () => toggle();
  const onCancel = () => toggle();

  useEffect(() => {
    onSearchTermUpdated(searchTerm);
  }, [onSearchTermUpdated, searchTerm]);

  const renderSearchSuggestions = () => {

    return suggestedSearches.map((suggestion, index) => (
      <button key={index} onClick={() => setSearchTerm(suggestion)}>{suggestion}</button>
    ));
  };

  return (
    <>
      <div id="search_container">
        <h3>Search:</h3>
        <input
          type="text"
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          value={searchTerm}
        />
      </div>
     
      <div id="search_suggestions">{renderSearchSuggestions()}</div>
      <p>Want to know about this project?</p>
      <button onClick={toggle}>Learn More</button>
      <Modal
        isShown={isShown}
        hide={toggle}
        headerText="Engage Yo' Council"
        modalContent={
          <ConfirmationModal
            onConfirm={onConfirm}
            onCancel={onCancel}
          >
            <div>
            Hi, and welcome!
            <br/>
            <br/>
            This tool is a proof of concept of a new way to interact with development proposals in your local council area. That means it’s not a finished product: we’re showing you how technology can make civic engagement accessible for more local residents.
            <br/>
            <br/>
            In particular, the data presented on this map is a snapshot collected on the 5th August 2020, and won’t be updated automatically with new data.
            <br/>
            <br/>
            The next step would be to build this for real, so that new proposals are accessible as they are published by councils!
            <br/>
            <br/>
            Engage yo' Council was made as part of a 24 hour hackathon by <a href="http://louislepper.co.nz">Louis Lepper</a>, <a href="https://jakecoppinger.com">Jake Coppinger</a>, Glenn Southern, <a href="http://benpartridge.me/">Ben Partridge</a>,
            Maddie Jones,
            Ciaran Hale, <a href="https://github.com/ajknoll">Avi Knoll</a>, <a href="https://jaygurnani.github.io">Jay Gurnani</a>, and Ratheesh Mohan 
              </div>
          </ConfirmationModal>
        }
      />

    </>
  );
};
