import {create} from "zustand"

type requestDataItem = {
    
}

type criarSelectedsRequestsStore = {
    lista: requestDataItem[];
    adicionarItem: (item: requestDataItem) => void;

}