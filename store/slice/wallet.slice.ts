import { empty } from "@/src/utils/corefunctions";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type walletSliceType = {
  chain_id?: number;
  wallet_address?: string;
  block_number?: number;
  open_wallet_sidebar?: boolean;
};

export const walletInitialState: walletSliceType = {
  chain_id: null,
  wallet_address: "",
  block_number: 0,
  open_wallet_sidebar: false,
};

export const walletSlice = createSlice({
  name: "walletInfo",
  initialState: walletInitialState,
  reducers: {
    setWallet: (state, action: PayloadAction<walletSliceType>) => {
      if (
        action.payload.chain_id &&
        state.chain_id != action.payload.chain_id
      ) {
        state.chain_id = action.payload.chain_id;
      }
      if (
        action.payload.wallet_address &&
        state.wallet_address?.toLowerCase() !=
          action.payload.wallet_address.toLowerCase()
      ) {
        state.wallet_address = action.payload.wallet_address;
      }
      if (action.payload.block_number) {
        state.block_number = action.payload.block_number;
      }
      if (!empty(action.payload.open_wallet_sidebar)) {
        state.open_wallet_sidebar = action.payload.open_wallet_sidebar;
      }
    },
    setToInitialWallet: (state) => {
      state.chain_id = walletInitialState.chain_id;
      state.wallet_address = walletInitialState.wallet_address;
      state.block_number = walletInitialState.block_number;
      state.open_wallet_sidebar = walletInitialState.open_wallet_sidebar;
    },
  },
});

export const { setWallet, setToInitialWallet } = walletSlice.actions;
export default walletSlice.reducer;
