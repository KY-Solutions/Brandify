
const buildFilterObject = (filters) => {
    const filterObject = {};


    //* price range

    if (filters.minPrice || filters.maxPrice) {
        filterObject.price = {};

        if (filters.minPrice) filterObject.price.$gte = parseFloat(filters.minPrice);
        if (filters.maxPrice) filterObject.price.$lte = parseFloat(filters.maxPrice);
    }

    //* text search for name and description
    if (filters.name) filterObject.name = { $regex: filters.name, $options: 'i' };
    if (filters.description) filterObject.description = { $regex: filters.description, $options: 'i' };

    //* sizes and colors filters
    if (filters.sizes) filterObject.sizes = { $in: filters.sizes.split(',') };
    if (filters.colors) filterObject.colors = { $in: filters.colors.split(',') }; // Match any of the colors

    return filterObject;
}

module.exports = { buildFilterObject };