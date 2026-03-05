export const initialState = {
  film: null,
  trailerKey: null,
  cast: [],
  similar: [],
  loading: true,
  error: null,
};

export const detailReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { ...initialState, loading: true };

    case "SUCCESS":
      return {
        ...state,
        loading: false,
        film: action.payload.film,
        trailerKey: action.payload.trailerKey,
        cast: action.payload.cast || [],
        similar: action.payload.similar || [],
      };

    case "ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
