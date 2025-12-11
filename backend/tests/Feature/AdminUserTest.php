<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->user = User::factory()->create(['role' => 'user']);
    }

    public function test_admin_can_view_all_users_with_pagination()
    {
        User::factory()->count(15)->create(['role' => 'user']);

        $response = $this->actingAs($this->admin)->getJson('/api/admin/users');

        $response->assertStatus(200)
            ->assertJsonCount(10, 'data')
            ->assertJsonStructure(['current_page', 'data', 'total']);
    }

    public function test_admin_can_update_user()
    {
        $response = $this->actingAs($this->admin)->putJson("/api/admin/users/{$this->user->id}", [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['message' => 'Pengguna berhasil diperbarui.']);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ]);
    }

    public function test_admin_can_delete_user()
    {
        $userToDelete = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($this->admin)->deleteJson("/api/admin/users/{$userToDelete->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['message' => 'Pengguna berhasil dihapus.']);

        $this->assertDatabaseMissing('users', ['id' => $userToDelete->id]);
    }

    public function test_admin_cannot_delete_own_account()
    {
        $response = $this->actingAs($this->admin)->deleteJson("/api/admin/users/{$this->admin->id}");

        $response->assertStatus(403)
            ->assertJsonFragment(['message' => 'Admin tidak dapat menghapus akun sendiri.']);
    }
}
