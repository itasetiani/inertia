import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Chirp from '@/Components/Chirp';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, Head } from '@inertiajs/react';
import WysiwygEditor from '@/Components/WysiwygEditor';
 
export default function Index({ auth, chirps }) {
    const [mediaPreview, setMediaPreview] = useState(null);
    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
        media: null,
    });
 
    const submit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('message', data.message);
        if (data.media) {
            formData.append('media', data.media);
        }

        post(route('chirps.store'), { 
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                reset();
                setMediaPreview(null);
            } 
        });
    };

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        setData('media', file);

        // Pratinjau media
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMediaPreview({
                    url: reader.result,
                    type: file.type
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const clearMedia = () => {
        setData('media', null);
        setMediaPreview(null);
    };
 
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Chirps" />
 
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <form onSubmit={submit}>
                 <div className='p-3 bg-white rounded-md'>
                    <p>Caption:</p>
                       <WysiwygEditor 
                        value={data.message} 
                        onChange={(value) => setData('message', value)} 
                    />
                 </div>
                    <InputError message={errors.message} className="mt-2" />
                    
                    {/* Input File */}
                    <div className="mt-4">
                        <input 
                            type="file" 
                            accept="image/*,video/*"
                            onChange={handleMediaChange}
                            className="block w-full text-sm text-gray-500 
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border
                            file:text-sm file:font-semibold
                            file:bg-green-50 file:text-green-700
                            file:border-green-700
                            hover:file:bg-green-100"
                        />
                    </div>

                    {/* Pratinjau Media */}
                    {mediaPreview && (
                        <div className="mt-4 relative">
                            {mediaPreview.type.startsWith('image/') ? (
                                <img 
                                    src={mediaPreview.url} 
                                    alt="Media Preview" 
                                    className="max-w-full h-auto rounded-lg"
                                />
                            ) : (
                                <video 
                                    src={mediaPreview.url} 
                                    controls 
                                    className="max-w-full h-auto rounded-lg"
                                />
                            )}
                            <button 
                                type="button"
                                onClick={clearMedia}
                                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full"
                            >
                                Delete
                            </button>
                        </div>
                    )}

                    <PrimaryButton 
                        className="mt-4" 
                        disabled={processing}
                    >
                        Upload
                    </PrimaryButton>
                </form>

                <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
                    {chirps.map(chirp =>
                        <Chirp key={chirp.id} chirp={chirp} />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}