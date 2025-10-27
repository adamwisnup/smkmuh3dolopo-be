export const generatePaginator = (page: number, limit: number, totalData: number) => {
  const pageCount = Math.ceil(totalData / limit);
  const slNo = page === 1 ? 0 : page * limit - 1;

  return {
    itemCount: totalData,
    limit: limit,
    pageCount: pageCount,
    page: page,
    slNo: slNo + 1,
    hasPrevPage: page > 1,
    hasNextPage: page < pageCount,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < pageCount ? page + 1 : null,
  };
};

export const defaultPaginator = (params: any) => {
  const page = params.page ? parseInt(params.page, 10) : 1;
  const limit = params.limit ? parseInt(params.limit, 10) : 10;
  const offset = page === 1 ? 0 : page * limit - limit;

  return { page, limit, offset };
};
