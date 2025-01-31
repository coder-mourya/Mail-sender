import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { EmailState, Recipient } from '../types';

const initialState: EmailState = {
  recipients: [],
  subject: '',
  content: '',
  loading: false,
  preview: null,
};

export const sendEmails = createAsyncThunk(
  'email/sendEmails',
  async (_, { getState }) => {
    const state = getState() as { email: EmailState };
    const response = await axios.post('http://localhost:3000/api/send-emails', {
      recipients: JSON.stringify(state.email.recipients),
      subject: state.email.subject,
      content: state.email.content,
    });
    console.log("response", response.data);
    
    return response.data;
  }
);

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    setRecipients: (state, action: PayloadAction<Recipient[]>) => {
      state.recipients = action.payload;
    },
    setSubject: (state, action: PayloadAction<string>) => {
      state.subject = action.payload;
    },
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    },
    setPreview: (state, action: PayloadAction<Recipient | null>) => {
      state.preview = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendEmails.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendEmails.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendEmails.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setRecipients, setSubject, setContent, setPreview } = emailSlice.actions;
export default emailSlice.reducer;