package com.codeflow.editor.di

import android.content.Context
import com.codeflow.editor.data.ai.AIApiClient
import com.codeflow.editor.data.ai.AIRepository
import com.codeflow.editor.data.git.GitRepository
import com.codeflow.editor.data.repository.FileRepository
import com.codeflow.editor.data.repository.SettingsRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideFileRepository(): FileRepository = FileRepository()

    @Provides
    @Singleton
    fun provideSettingsRepository(
        @ApplicationContext context: Context
    ): SettingsRepository = SettingsRepository(context)

    @Provides
    @Singleton
    fun provideAIApiClient(): AIApiClient = AIApiClient()

    @Provides
    @Singleton
    fun provideAIRepository(
        @ApplicationContext context: Context,
        apiClient: AIApiClient
    ): AIRepository = AIRepository(context, apiClient)

    @Provides
    @Singleton
    fun provideGitRepository(): GitRepository = GitRepository()
}
