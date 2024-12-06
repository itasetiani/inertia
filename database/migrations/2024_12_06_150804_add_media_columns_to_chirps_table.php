<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('chirps', function (Blueprint $table) {
            if (!Schema::hasColumn('chirps', 'media_path')) {
                $table->string('media_path')->nullable();
            }
            
            if (!Schema::hasColumn('chirps', 'media_type')) {
                $table->string('media_type')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('chirps', function (Blueprint $table) {
            if (Schema::hasColumn('chirps', 'media_path')) {
                $table->dropColumn('media_path');
            }
            
            if (Schema::hasColumn('chirps', 'media_type')) {
                $table->dropColumn('media_type');
            }
        });
    }
};