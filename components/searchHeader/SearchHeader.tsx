import './SearchHeader.scss';
import { IconButton } from '@material-ui/core';
import React, { useContext } from 'react';
import EvaIcons from 'bloben-common/components/eva-icons';
import { Context } from '../../context/store';
import { Input } from '../input/Input';

interface ISearchInputProps {
  typedText: string;
  onChange: any;
  placeholder?: string;
  submitEnter?: any;
}
const SearchInput = (props: ISearchInputProps) => {
  const { typedText, onChange, placeholder, submitEnter } = props;

  const [store] = useContext(Context);
  const { isDark, isMobile } = store;

  return (
    <div className={'search__input-wrapper'}>
      <Input
        className={`search__input${isDark ? '-dark' : ''}`}
        placeholder={placeholder ? placeholder : 'Search'}
        autoFocus={isMobile}
        name={'name'}
        autoComplete={'off'}
        value={typedText}
        onChange={onChange}
        multiline={false}
        submitEnter={submitEnter}
      />
    </div>
  );
};

interface ISearchHeaderProps {
  typedText: string;
  onSearchInput: any;
  handleClearSearch: any;
  goBack: any;
  placeholder?: string;
  submitEnter?: any;
}
const SearchHeader = (props: ISearchHeaderProps) => {
  const { typedText, onSearchInput, handleClearSearch, goBack, placeholder, submitEnter } = props;

  const [store] = useContext(Context);
  const { isDark, isMobile } = store;

  return (
    <div className={'search__header-container'}>
      <IconButton
        onClick={goBack}
        className={`${isMobile ? '' : 'small-icon-button'}`}
      >
        <EvaIcons.ArrowBack
          className={`icon-svg${isDark ? '-dark' : ''} ${
            !isMobile ? 'small-svg' : ''
          }`}
        />
      </IconButton>
      <SearchInput
        typedText={typedText}
        onChange={onSearchInput}
        placeholder={placeholder}
        submitEnter={submitEnter}
      />
      {typedText ? (
        <IconButton
          onClick={handleClearSearch}
          className={`${isMobile ? '' : 'small-icon-button'}`}
        >
          <EvaIcons.Cross
            className={`icon-svg${isDark ? '-dark' : ''} ${
              !isMobile ? 'small-svg' : ''
            }`}
          />
        </IconButton>
      ) : (
        <IconButton
          disabled={true}
          className={`${isMobile ? '' : 'small-icon-button'}`}
        >
          <EvaIcons.Search
            className={`icon-svg${isDark ? '-dark' : ''} ${
              !isMobile ? 'small-svg' : ''
            }`}
          />
        </IconButton>
      )}
    </div>
  );
};

export default SearchHeader;
