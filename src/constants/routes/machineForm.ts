import { SelectInterface } from "@/types/iu";

export const machineSelector:SelectInterface[] = [
    { value:'excavator', label:'Excavadora', color: '#fff' },
    { value:'bulldozer',label: 'Bulldozer', color: '#fff' },
    {value:'crane',label: 'Grúa', color: '#fff' },
    {value: 'loader',label: 'Cargador', color: '#fff' },
    {value:'compactor',label: 'Compactador', color: '#fff' },
    {value: 'other' ,label: 'Otro', color: '#fff' },
]

export const statusOptions: SelectInterface[] = [
    { value: 'available', label: 'Disponible', color: '#fff' },
    { value: 'rented', label: 'Rentada', color: '#fff' },
    { value: 'maintenance', label: 'Mantenimiento', color: '#fff' },
    { value: 'retired', label: 'Retirada', color: '#fff' },
]

export const fuel_type_options: SelectInterface[] = [
    { value: 'diesel', label: 'Diésel', color: '#fff' },
    { value: 'electric', label: 'Eléctrica', color: '#fff' },
    { value: 'gas', label: 'Gas', color: '#fff' },
    { value: 'hybrid', label: 'Híbrida', color: '#fff' },
    { value: 'other', label: 'Otro', color: '#fff' },
]

