import React, { useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { useForm, usePage } from '@inertiajs/react';
import WysiwygEditor from './WysiwygEditor';

dayjs.extend(relativeTime);

export default function Chirp({ chirp }) {
        const { auth } = usePage().props;

    const [editing, setEditing] = useState(false);

    const { data, setData, patch, clearErrors, reset, errors } = useForm({
        message: chirp.message,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('chirps.update', chirp.id), { onSuccess: () => setEditing(false) });
    };

    const renderMedia = (mediaPath, mediaType) => {
        if (!mediaPath) return null;

        const isImage = mediaType.startsWith('image/');
        const isVideo = mediaType.startsWith('video/');

        if (isImage) {
            return (
                <img 
                    src={`/storage/${mediaPath}`} 
                    alt="Chirp media" 
                    className="max-w-full h-auto mt-4 rounded-lg"
                />
            );
        }

        if (isVideo) {
            return (
                <video 
                    controls 
                    className="max-w-full h-auto mt-4 rounded-lg"
                >
                    <source src={`/storage/${mediaPath}`} type={mediaType} />
                    Your browser does not support the video tag.
                </video>
            );
        }

        return null;
    };

    return (
        <div className="p-6 flex space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-gray-800">{chirp.user.name}</span>
                        <small className="ml-2 text-sm text-gray-600">{dayjs(chirp.created_at).fromNow()}</small>
                        {chirp.created_at !== chirp.updated_at && <small className="text-sm text-gray-600"> &middot; edited</small>}
                    </div>
                    {chirp.user.id === auth.user.id && (
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <button 
                                    className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out" 
                                    onClick={() => setEditing(true)}
                                >
                                    Edit
                                </button>
                                <Dropdown.Link as="button" href={route('chirps.destroy', chirp.id)} method="delete">
                                    Delete
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    )}
                </div>
                
                {editing ? (
                    <form onSubmit={submit} encType="multipart/form-data">
                        <WysiwygEditor 
                            value={data.message} 
                            onChange={(value) => setData('message', value)} 
                        />
                        <InputError message={errors.message} className="mt-2" />
                        
                  
                        <div className="space-x-2 mt-4">
                            <PrimaryButton>Save</PrimaryButton>
                            <button 
                                type="button"
                                onClick={() => { 
                                    setEditing(false); 
                                    reset(); 
                                    clearErrors(); 
                                    setPreviewMedia(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <div 
                            className="mt-4 text-lg text-gray-900" 
                            dangerouslySetInnerHTML={{ __html: chirp.message }} 
                        />
                        {chirp.media_path && renderMedia(chirp.media_path, chirp .media_type)}
                    </div>
                )}
            </div>
        </div>
    );
}