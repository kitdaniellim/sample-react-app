import { useState, useEffect } from "react";

interface NewsData {
  id: number;
  title: string;
  url: string;
  score: number;
  time: number;
  by: string;
}

const News = () => {
  const [newsData, setNewsData] = useState<NewsData[]>([]);
  const [storyIds, setStoryIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    activePage: 1,
    itemsPerPage: 10,
  });

  const totalPages = Math.ceil(storyIds.length / state.itemsPerPage);

  useEffect(() => {
    fetchStoryIds();
  }, []);

  useEffect(() => {
    if (storyIds.length > 0) {
      fetchCurrentPageStories();
    }
  }, [state.activePage, storyIds]);

  const fetchStoryIds = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://hacker-news.firebaseio.com/v0/topstories.json"
      );
      const data = await response.json();
      const storyIds = data.slice(0, 500);
      setStoryIds(storyIds);
    } catch (error) {
      console.error("Error fetching story IDs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentPageStories = async () => {
    try {
      setLoading(true);
      const startIndex = (state.activePage - 1) * state.itemsPerPage;
      const endIndex = startIndex + state.itemsPerPage;
      const currentPageIds = storyIds.slice(startIndex, endIndex);

      const storyPromises = currentPageIds.map((storyId) =>
        fetch(
          `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
        ).then((res) => res.json())
      );

      const stories = await Promise.all(storyPromises);
      setNewsData(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setState((prev) => ({ ...prev, activePage: pageNumber }));
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 10;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <button key={i} onClick={() => handlePageChange(i)}>
            {i}
          </button>
        );
      }
    } else {
      const start = Math.max(1, state.activePage - 2);
      const end = Math.min(totalPages, state.activePage + 2);

      if (start > 1) {
        items.push(
          <button key={1} onClick={() => handlePageChange(1)}>
            1
          </button>
        );
        if (start > 2) {
          items.push(
            <span key="start-ellipsis" className="px-2">
              ...
            </span>
          );
        }
      }

      for (let i = start; i <= end; i++) {
        items.push(
          <button key={i} onClick={() => handlePageChange(i)}>
            {i}
          </button>
        );
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          items.push(
            <span key="end-ellipsis" className="px-2">
              ...
            </span>
          );
        }
        items.push(
          <button key={totalPages} onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </button>
        );
      }
    }

    return items;
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {newsData.length > 0 && (
        <div>
          {newsData.map((story: NewsData, index: number) => (
            <div key={story?.id || index}>
              <h3>{story && <span>{story?.title}</span>}</h3>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div>
          <button
            onClick={() => handlePageChange(state.activePage - 1)}
            disabled={state.activePage === 1}
          >
            Previous
          </button>

          {renderPaginationItems()}

          <button
            onClick={() => handlePageChange(state.activePage + 1)}
            disabled={state.activePage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <div>
        <small>
          Page {state.activePage} of {totalPages} | Showing{" "}
          {(state.activePage - 1) * state.itemsPerPage + 1}-
          {Math.min(state.activePage * state.itemsPerPage, storyIds.length)} of{" "}
          {storyIds.length} stories
        </small>
      </div>
    </div>
  );
};

export default News;
