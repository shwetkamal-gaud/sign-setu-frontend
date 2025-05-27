import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios';
export interface Word {
    _id: string;
    word: string;
    definition: string;
    imageUrl: string;
    videoUrl: string;
}

const API_URL = 'http://localhost:5000/words';

interface WordState {
    data: Word[];
    loading: boolean;
    error: string | null;
}

const initialState: WordState = {
    data: [],
    loading: false,
    error: null,
};


export const fetchWords = createAsyncThunk<Word[]>('words/fetchWords', async () => {
    const response = await axios.get(API_URL);
    console.log(response.data)
    return response.data.words;
});

export const addNewWord = createAsyncThunk<Word, Omit<Word, '_id'>>(
    'words/addNewWord',
    async (wordData) => {
        const response = await axios.post(API_URL, wordData);
        return response.data;
    }
);

export const updateWordById = createAsyncThunk<Word, { id: string; updatedData: Partial<Word> }>(
    'words/updateWordById',
    async ({ id, updatedData }) => {
        const { _id, ...safeUpdate } = updatedData;
        const response = await axios.put(`${API_URL}/${id}`, safeUpdate);
        return response.data;
    }
);

export const deleteWordById = createAsyncThunk<string, string>(
    'words/deleteWordById',
    async (id) => {
        await axios.delete(`${API_URL}/${id}`);
        return id;
    }
);

const wordSlice = createSlice({
    name: 'words',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWords.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWords.fulfilled, (state, action: PayloadAction<Word[]>) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(fetchWords.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch words';
            })
            .addCase(addNewWord.fulfilled, (state, action: PayloadAction<Word>) => {
                state.data.push(action.payload);
            })
            .addCase(updateWordById.fulfilled, (state, action: PayloadAction<Word>) => {
                const index = state.data.findIndex((w) => w._id === action.payload._id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(deleteWordById.fulfilled, (state, action: PayloadAction<string>) => {
                state.data = state.data.filter((w) => w._id !== action.payload);
            });
    },
});

export default wordSlice.reducer;