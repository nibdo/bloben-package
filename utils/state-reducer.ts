
const StateReducer: any = (state: any, action: any): any => {
  // Replace whole state
  if (!action.payload) {
    return { ...state, ...action };
  }

  const { stateName, type, data } = action.payload;

  switch (type) {
    default:
      return {
        ...state,
        [stateName]: data,
      };
    case 'replace':
      const { prevItem, newItem } = data;
      const array = [...state[stateName]].map((item: any) =>
        item.id === prevItem.id ? newItem : item
      );

      return {
        ...state,
        [stateName]: array,
      };
    case 'simple':
      return {
        ...state,
        [stateName]: data,
      };
    case 'create':
      return {
        ...state,
        [stateName]: [...state[stateName], data],
      };
    case 'createObj':
      return {
        ...state,
        [stateName]: [...state[stateName], data],
      };
    case 'update':
      const updatedArray = [...state[stateName]].map((item: any) =>
        item.id === data.id ? data : item
      );

      return {
        ...state,
        [stateName]: updatedArray,
      };
    case 'saveObj':
      if (data.taskId) {
        const subTaskState: any = { ...state[stateName] };
        const updatedArrayObj: any = [subTaskState[data.taskId], data];

        return {
          ...state,
          [stateName]: { ...subTaskState, ...updatedArrayObj },
        };
      }
    case 'updateObj':
      if (data.taskId) {
        const subTaskArray: any = [...state[stateName][data.taskId]];

        const updatedArrayObj: any = subTaskArray.map((item: any) =>
          item.id === data.id ? data : item
        );

        // const updatedState: any = {
        //   [data.taskId]: updatedArrayObj,
        // };

        return {
          ...state,
          [stateName]: {
            ...state[stateName],
            [data.taskId]: updatedArrayObj,
          },
        };
      }
    case 'deleteObj':
      if (data.taskId) {
        const subTaskArray: any = [...state[stateName][data.taskId]];
        const updatedArrayObj: any = subTaskArray.filter(
          (item: any) => item.id !== data.id
        );

        return {
          ...state,
          [stateName]: {
            ...state[stateName],
            [data.taskId]: updatedArrayObj,
          },
        };
      }
    case 'delete':
      const filteredArray = [...state[stateName]].filter(
        (item) => item.id !== data.id
      );

      return {
        ...state,
        [stateName]: filteredArray,
      };
  }
};

export default StateReducer;
