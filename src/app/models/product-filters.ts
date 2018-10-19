import { Item } from './item';
import { Country } from './country';

export class ProductFilters {
    size: Item[];
    type: Item[];
    price: Item[];
    countries: Country[];
}
