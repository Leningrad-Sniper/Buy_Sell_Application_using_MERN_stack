import {
    Book,
    Devices,
    Checkroom,
    Kitchen,
    SportsSoccer,
    Chair,
    Edit,
    ShoppingBag,
    Category
} from '@mui/icons-material';

// Return the component directly instead of the function
export const getCategoryIcon = (category) => {
    const icons = {
        books: Book,
        electronics: Devices,
        clothing: Checkroom,
        kitchenware: Kitchen,
        sports: SportsSoccer,
        furniture: Chair,
        stationery: Edit,
        accessories: ShoppingBag,
        others: Category
    };

    return icons[category] || Category;
}; 