import uuidv4 from 'uuid/v4';
// import _ from 'lodash';
// import { cardMapping } from 'appLoadable';

export const initCardsLayouts = (
  cards,
  layouts,
  { group, params: paramsFromPage = {}, data: dataFromPage = {} } = {}
) => {
  const idMap = {};
  const newCards = Object.keys(cards).reduce((cardsCreated, i) => {
    const { uid = uuidv4(), type } = cards[i];
    // const { uid = uuidv4(), type, configs: instanceConfigs = {} } = cards[i];
    // const mappedType = cardMapping[type];
    idMap[i] = uid;

    // FIXME: Not sure paramsFromPage and dataFromPage are necessary
    return {
      ...cardsCreated,
      [uid]: {
        uid,
        type,
        params: paramsFromPage,
        data: dataFromPage,
        ...rest,
      },
    };

    // if (!mappedType) {
    //   return {
    //     ...cardsCreated,
    //     [uid]: { uid, type },
    //   };
    // }

    // const { imports: { configs: definitionConfigs = {} } } = mappedType;
    // const { params = {}, data = {} } = instanceConfigs;
    // _.merge(params, paramsFromPage);
    // _.merge(data, dataFromPage);

    // return {
    //   ...cardsCreated,
    //   [uid]: _.merge(
    //     { uid, type },
    //     definitionConfigs,
    //     instanceConfigs,
    //     { data },
    //     { params }
    //   ),
    // };
  }, {});

  const newLayouts = Object.keys(layouts).reduce(
    (newLayout, type) =>
      Object.assign(newLayout, {
        [type]: layouts[type].map(({ i, ...rest }) => ({
          i: idMap[i] || uuidv4(),
          ...rest,
        })),
      }),
    {}
  );
  const result = {
    layouts: newLayouts,
    cards: newCards,
  };
  if (group) {
    const newGroup = group.map((i) => {
      const newList = i.list.map((item) => idMap[item]);
      return { ...i, list: newList };
    });
    result.group = newGroup;
  }
  return result;
};
