import {
  Button,
  Input,
  Select,
  Typography,
} from '@material-tailwind/react';

import {
  Search,
  Xmark,
} from 'iconoir-react';

import FlexSpacer from './FlexSpacer';
import SearchCard from './SearchCard';

import useSearch from '../hooks/useSearch';

/**
 * Renders a list of algorithm cards inside a dynamically filtered search frame.
 *
 * @param {Object} props
 *        React props
 * @param {Array} props.cards
 *        The list of algorithms to display
 *
 * @returns {JSX.Element} The rendered search provider element
 */
export default function SearchProvider(
  {
    cards,
  }:
  {
    cards: readonly {
      img: readonly [string, string] | string
      title: string
      tags: readonly string[]
      href: string
    }[]
  },
) {
  const [
    favs,
    activeTags,
    sort,
    search,
    setFavs,
    setActiveTags,
    setSort,
    setSearch,
  ] = useSearch();

  function toggleFav(key: string) {
    if ((favs || []).includes(key)) {
      setFavs((favs || []).filter((k: string) => k !== key));
    } else {
      setFavs([...(favs || []), key]);
    }
  }

  function toggleTag(tag: string) {
    if ((activeTags || []).includes(tag)) {
      setActiveTags((activeTags || []).filter((t: string) => t !== tag));
    } else {
      setActiveTags([...(activeTags || []), tag]);
    }
  }

  // Allow search queries to be modified to match special sequences
  // (e.g. ^n for superscript n)
  function formatSearch(search: string) {
    if (typeof (formatSearch as any).regexes === 'undefined') {
      (formatSearch as any).regexes = [
        [new RegExp(`\\^0`, 'g'), '\u2070'], // Superscript 0
        [new RegExp(`\\^1`, 'g'), '\u00B9'], // Superscript 1
        [new RegExp(`\\^2`, 'g'), '\u00B2'], // Superscript 2
        [new RegExp(`\\^3`, 'g'), '\u00B3'], // Superscript 3
        [new RegExp(`\\^4`, 'g'), '\u2074'], // Superscript 4
        [new RegExp(`\\^5`, 'g'), '\u2075'], // Superscript 5
        [new RegExp(`\\^6`, 'g'), '\u2076'], // Superscript 6
        [new RegExp(`\\^7`, 'g'), '\u2077'], // Superscript 7
        [new RegExp(`\\^8`, 'g'), '\u2078'], // Superscript 8
        [new RegExp(`\\^9`, 'g'), '\u2079'], // Superscript 9
        [new RegExp(`\\^n`, 'g'), '\u207F'], // Superscript n
      ];
    }

    for (const regex of (formatSearch as any).regexes) {
      search = search.replace(regex[0], regex[1]);
    }

    return search;
  }

  return (
    <section className="h-full overflow-y-scroll">
      <form
        role="search"
        aria-label="Sort and search results"
        className="flex portrait:flex-col portrait:gap-2 items-center py-3 px-4 sticky z-50 top-0 bg-[#ffffff] dark:bg-[#18181c] border-b border-[#d8d8dc] dark:border-[#38383c]"
      >
        <div className="w-96 max-w-full">
          <Input
            type="search"
            placeholder="Find an algorithm..."
            aria-label="Find an algorithm"
            value={(search || '')}
            onChange={e => setSearch(e.target.value)}
            className="shadow-none border-[#d8d8dc] dark:border-[#38383c] hover:border-[#b8b8bc] hover:dark:border-[#58585c] focus:border-[#98989c] focus:dark:border-[#78787c]"
          >
            <Input.Icon
              as="button"
              placement="end"
              onClick={
                (e) => {
                  setSearch('');
                  e.preventDefault();
                }
              }
              className="pointer-events-auto cursor-pointer hover:text-primary focus-visible:text-primary"
            >
              {
                (search || '') ?
                  <Xmark className="h-full w-full stroke-2" role="presentation" /> :
                  <Search className="h-full w-full stroke-2" role="presentation" />
              }
            </Input.Icon>
          </Input>
        </div>

        <div className="flex flex-wrap gap-1 p-0 ml-4 portrait:justify-center portrait:ml-0 empty:hidden">
          {
            (activeTags || []).map(
              (tag: string) => (
                <Button
                  key={tag}
                  size="sm"
                  variant="outline"
                  aria-label={`Remove ${tag} tag filter`}
                  title={`Remove ${tag} tag filter`}
                  onClick={
                    (e) => {
                      toggleTag(tag);
                      e.preventDefault();
                    }
                  }
                  className="border-primary/50 text-sm shadow-none cursor-pointer"
                >
                  <Typography>{tag}</Typography>
                  <Xmark className="h-4 w-4 stroke-2 translate-x-2" role="presentation" />
                </Button>
              ),
            )
          }
        </div>

        <FlexSpacer className="portrait:hidden" />

        <div className="flex items-center">
          <Typography
            as="label"
            htmlFor="sort-options"
            className="pr-2 text-primary/70 cursor-pointer"
          >
            Sort&nbsp;by:
          </Typography>

          <Select
            value={((sort === null) ? 'favorites' : sort)}
            onValueChange={setSort}
          >
            <Select.Trigger
              id="sort-options"
              placeholder="Select..."
              aria-label="Select sort order"
              title="Select sort order"
              className="w-44 shadow-none cursor-pointer text-primary/70 border-[#d8d8dc] dark:border-[#38383c] hover:border-[#b8b8bc] hover:dark:border-[#58585c] focus:border-[#98989c] focus:dark:border-[#78787c] data-[open=true]:border-[#98989c] data-[open=true]:dark:border-[#78787c]"
            />
            <Select.List className="*:cursor-pointer *:text-primary/70 *:hover:bg-primary/5! *:focus:bg-primary/5! border-[#d8d8dc] dark:border-[#38383c] transition-none bg-[#ffffff] dark:bg-[#18181c]">
              <Select.Option value="favorites">Sort: Favorites</Select.Option>
              <Select.Option value="name-desc">Sort: Name (Desc)</Select.Option>
              <Select.Option value="name-asc">Sort: Name (Asc)</Select.Option>
            </Select.List>
          </Select>
        </div>
      </form>

      <div className="flex flex-wrap justify-center gap-4 py-6 px-4">
        {
          cards
            .map(
              (
                { img, title, tags, href },
              ) => (
                <SearchCard
                  key={title}
                  img={img}
                  title={title}
                  tags={tags}
                  href={href}
                  favs={favs}
                  toggleFav={toggleFav}
                  activeTags={activeTags}
                  toggleTag={toggleTag}
                />
              ),
            )
            .filter( // Filter by selected tags
              (card) => {
                return !(activeTags || []).length ||
                  (activeTags || [])
                    .every((tag: string) => card.props.tags.includes(tag));
              },
            )
            .filter( // Filter by search query
              (card) => {
                return !(search || '') ||
                  card.props.title.toLowerCase()
                    .includes((formatSearch(search!) || '').toLowerCase()) ||
                    card.props.tags.some((tag: string) => tag.toLowerCase()
                      .includes((formatSearch(search!) || '').toLowerCase()));
              },
            )
            .sort( // Sort by selected sort option
              (a, b) => {
                switch ((sort === null) ? 'favorites' : sort) {
                  case 'favorites':
                  case 'name-desc':
                    return b.props.title < a.props.title ? 1 : -1;
                  case 'name-asc':
                    return a.props.title < b.props.title ? 1 : -1;
                  default:
                    return 0;
                }
              },
            )
            .sort( // Sort by favorite status
              (a, b) => {
                if (((sort === null) ? 'favorites' : sort) !== 'favorites') return 0;

                if ((favs || []).includes(a.props.title)) return -1;
                if ((favs || []).includes(b.props.title)) return 1;
                return 0;
              },
            )
        }
      </div>
    </section>
  );
}
