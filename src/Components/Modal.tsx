import React from 'react'
import ReactDOM from 'react-dom'
import { X } from 'lucide-react'

type Word = {
    word: string
    definition: string
    imageUrl: string;
    videoUrl: string;
}

type ModalProps = {
    onClose: () => void
    wordData: Word
    setWordData: React.Dispatch<React.SetStateAction<Word>>
    isEdit: boolean
    onCreate: () => void
    onUpdate: () => void
}

const WordModal: React.FC<ModalProps> = ({
    onClose,
    wordData,
    setWordData,
    isEdit,
    onCreate,
    onUpdate
}) => {
    const handleSubmit = () => {
        if (!wordData.word.trim() || !wordData.definition.trim()) return
        isEdit ? onUpdate() : onCreate()
        onClose()
    }

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)]">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
                <div className="border-b p-4 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {isEdit ? 'Edit Word' : 'Add Word'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <X />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <input
                        required
                        type="text"
                        placeholder="Word"
                        className="w-full border border-gray-300 rounded-lg p-2"
                        value={wordData.word}
                        onChange={(e) =>
                            setWordData((prev) => ({ ...prev, word: e.target.value }))
                        }
                    />

                    <textarea
                        required
                        placeholder="Definition"
                        className="w-full border border-gray-300 rounded-lg p-2 h-24"
                        value={wordData.definition}
                        onChange={(e) =>
                            setWordData((prev) => ({ ...prev, definition: e.target.value }))
                        }
                    />

                    <input
                        type="text"
                        placeholder="Image URL (optional)"
                        className="w-full border border-gray-300 rounded-lg p-2"
                        value={wordData.imageUrl || ''}
                        onChange={(e) =>
                            setWordData((prev) => ({ ...prev, imageUrl: e.target.value }))
                        }
                    />

                    <input
                        type="text"
                        placeholder="Video URL (optional)"
                        className="w-full border border-gray-300 rounded-lg p-2"
                        value={wordData.videoUrl || ''}
                        onChange={(e) =>
                            setWordData((prev) => ({ ...prev, videoUrl: e.target.value }))
                        }
                    />
                </div>

                <div className="flex justify-end gap-4 p-4">
                    <button
                        className="py-2 px-4 rounded-lg bg-gray-200"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="py-2 px-4 rounded-lg bg-blue-500 text-white"
                        onClick={handleSubmit}
                    >
                        {isEdit ? 'Update' : 'Add'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default WordModal
