'use server';

import { client } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

type AuthResponse = {
  status: number;
  id?: string;
  image?: string;
  username?: string;
  error?: string;
};

export const onAuthenticatedUser = async (): Promise<AuthResponse> => {
  try {
    const clerk = await currentUser();
    if (!clerk) return { status: 404, error: 'User not found' };

    const user = await client.user.findUnique({
      where: { clerkId: clerk.id },
      select: { id: true, firstname: true, lastname: true },
    });

    if (!user) return { status: 404, error: 'User not found in database' };

    const firstname = user.firstname ?? '';
    const lastname = user.lastname ?? '';

    return {
      status: 200,
      id: user.id,
      image: clerk.imageUrl ?? undefined,
      username: `${firstname} ${lastname}`.trim() || undefined,
    };
  } catch (error) {
    console.error('Authentication error:', error);

    return {
      status: 500,
      error: 'Internal server error',
    };
  }
};

export const onSignUpUser = async (data: {
  firstname: string;
  lastname: string;
  image: string;
  clerkId: string;
}) => {
  try {
    const createdUser = await client.user.create({ data });

    return {
      status: 200,
      message: 'User successfully created',
      id: createdUser.id,
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      status: 400,
      message: error instanceof Error ? error.message : 'Failed to create user',
    };
  }
};

export const onSignInUser = async (clerkId: string) => {
  try {
    const loggedInUser = await client.user.findUnique({
      where: { clerkId },
      select: {
        id: true,
        group: {
          select: {
            id: true,
            channel: {
              select: { id: true },
              take: 1,
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });

    if (!loggedInUser) {
      return { status: 404, message: 'User not found' };
    }

    if (loggedInUser.group.length > 0) {
      return {
        status: 207,
        id: loggedInUser.id,
        groupId: loggedInUser.group[0].id,
        channelId: loggedInUser.group[0].channel[0]?.id,
      };
    }

    return {
      status: 200,
      message: 'User successfully logged in',
      id: loggedInUser.id,
    };
  } catch (error) {
    console.error('Error signing in user:', error);
    return {
      status: 400,
      message: error instanceof Error ? error.message : 'Failed to sign in user',
    };
  }
};
