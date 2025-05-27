import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from './Modal';
import { Pencil, Trash2 } from 'lucide-react';
import {
    fetchWords,
    addNewWord,
    updateWordById,
    deleteWordById,
} from '../store/slices/wordSclice';
import type { AppDispatch, RootState } from '../store/store';

type LocalWord = {
    word: string;
    definition: string;
    imageUrl: string;
    videoUrl: string;
};

const Home: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data: words, loading } = useSelector((state: RootState) => state.words);

    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedWordId, setSelectedWordId] = useState<string | null>(null);

    const [wordData, setWordData] = useState<LocalWord>({
        word: '',
        definition: '',
        imageUrl: '',
        videoUrl: '',
    });

    useEffect(() => {
        dispatch(fetchWords());
    }, [dispatch]);

    const handleAdd = () => {
        setIsEdit(false);
        setWordData({ word: '', definition: '', imageUrl: '', videoUrl: '' });
        setModalOpen(true);
    };

    const handleCreate = () => {
        dispatch(addNewWord(wordData));
        setModalOpen(false);
    };

    const handleEdit = (id: string) => {
        setIsEdit(true);
        setSelectedWordId(id);
        const wordToEdit = words.find((w) => w._id === id);
        if (wordToEdit) {
            setWordData({
                word: wordToEdit.word,
                definition: wordToEdit.definition,
                imageUrl: wordToEdit.imageUrl,
                videoUrl: wordToEdit.videoUrl,
            });
            setModalOpen(true);
        }
    };

    const handleUpdate = () => {
        if (!selectedWordId) return;
        console.log(selectedWordId, wordData)
        dispatch(updateWordById({ id: selectedWordId, updatedData: wordData }));
        setModalOpen(false);
    };

    const handleDelete = (id: string) => {
        dispatch(deleteWordById(id));
    };

    const filteredWords = words?.filter((w) =>
        w?.word?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full p-6">
            <div className="flex justify-between items-center mb-6">
                <input
                    type="text"
                    placeholder="Search words..."
                    className="border border-gray-300 rounded-lg p-2 w-full max-w-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    onClick={handleAdd}
                    className="ml-4 bg-blue-600 text-white py-2 px-4 rounded-lg"
                >
                    Add Word
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : filteredWords.length === 0 ? (
                <p className="text-gray-500">No words found.</p>
            ) : (
                <ul className="space-y-4">
                    {filteredWords.map((w) => (
                        <li
                            key={w._id}
                            className="shadow p-4 rounded-lg flex justify-between items-start gap-4"
                        >
                            <div className='w-full'>
                                <h3 className="text-lg font-semibold">{w.word}</h3>
                                <p className="text-gray-700">{w.definition}</p>
                                <div className="flex flex-col md:flex-row w-full gap-4 mt-4">
                                    {w.imageUrl && (
                                        <img
                                            src={w.imageUrl}
                                            alt={w.word}
                                            className="w-full md:w-1/2 h-64 object-cover rounded-md"
                                        />
                                    )}
                                    {w.videoUrl && (
                                        <video
                                            controls
                                            src={w.videoUrl}
                                            className="w-full md:w-1/2 h-64 object-cover rounded-md"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(w._id)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <Pencil />
                                </button>
                                <button
                                    onClick={() => handleDelete(w._id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Trash2 />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {modalOpen && (
                <Modal
                    isEdit={isEdit}
                    onClose={() => setModalOpen(false)}
                    wordData={wordData}
                    setWordData={setWordData}
                    onCreate={handleCreate}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default Home;
