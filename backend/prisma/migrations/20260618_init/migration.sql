-- CreateTable
CREATE TABLE "currencies" (
    "code" VARCHAR(3) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "decimal_places" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "countries" (
    "iso2" VARCHAR(2) NOT NULL,
    "iso3" VARCHAR(3) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "flag_url" VARCHAR(255) NOT NULL,
    "currency_code" VARCHAR(3) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("iso2")
);

-- CreateTable
CREATE TABLE "game_types" (
    "id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "game_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" UUID NOT NULL,
    "external_id" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "provider_name" VARCHAR(100) NOT NULL,
    "thumbnail_url" VARCHAR(500),
    "start_url" VARCHAR(500),
    "game_type_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_countries" (
    "game_id" UUID NOT NULL,
    "country_iso2" VARCHAR(2) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_countries_pkey" PRIMARY KEY ("game_id","country_iso2")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL,
    "country_iso2" VARCHAR(2) NOT NULL,
    "preferred_currency_code" VARCHAR(3) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_favorite_games" (
    "user_id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_favorite_games_pkey" PRIMARY KEY ("user_id","game_id")
);

-- CreateTable
CREATE TABLE "spin_history" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "reel1_symbol" VARCHAR(20) NOT NULL,
    "reel2_symbol" VARCHAR(20) NOT NULL,
    "reel3_symbol" VARCHAR(20) NOT NULL,
    "reel_result_key" VARCHAR(100) NOT NULL,
    "bet_amount" DECIMAL(12,2) NOT NULL,
    "payout_amount" DECIMAL(12,2) NOT NULL,
    "net_amount" DECIMAL(12,2) NOT NULL,
    "balance_before" DECIMAL(12,2) NOT NULL,
    "balance_after" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spin_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_iso3_key" ON "countries"("iso3");

-- CreateIndex
CREATE INDEX "countries_currency_code_idx" ON "countries"("currency_code");

-- CreateIndex
CREATE UNIQUE INDEX "game_types_code_key" ON "game_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "games_external_id_key" ON "games"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "games_slug_key" ON "games"("slug");

-- CreateIndex
CREATE INDEX "games_title_idx" ON "games"("title");

-- CreateIndex
CREATE INDEX "idx_games_provider_name" ON "games"("provider_name");

-- CreateIndex
CREATE INDEX "idx_games_game_type_id" ON "games"("game_type_id");

-- CreateIndex
CREATE INDEX "idx_game_countries_country_iso2" ON "game_countries"("country_iso2");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_country_iso2" ON "users"("country_iso2");

-- CreateIndex
CREATE INDEX "idx_user_favorite_games_game_id" ON "user_favorite_games"("game_id");

-- CreateIndex
CREATE INDEX "idx_spin_history_user_created_at" ON "spin_history"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_spin_history_game_id" ON "spin_history"("game_id");

-- AddForeignKey
ALTER TABLE "countries" ADD CONSTRAINT "countries_currency_code_fkey" FOREIGN KEY ("currency_code") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_game_type_id_fkey" FOREIGN KEY ("game_type_id") REFERENCES "game_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_countries" ADD CONSTRAINT "game_countries_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_countries" ADD CONSTRAINT "game_countries_country_iso2_fkey" FOREIGN KEY ("country_iso2") REFERENCES "countries"("iso2") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_country_iso2_fkey" FOREIGN KEY ("country_iso2") REFERENCES "countries"("iso2") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_preferred_currency_code_fkey" FOREIGN KEY ("preferred_currency_code") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorite_games" ADD CONSTRAINT "user_favorite_games_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorite_games" ADD CONSTRAINT "user_favorite_games_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spin_history" ADD CONSTRAINT "spin_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spin_history" ADD CONSTRAINT "spin_history_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add CHECK constraints
ALTER TABLE "users" ADD CONSTRAINT "users_balance_check" CHECK (balance >= 0);

ALTER TABLE "spin_history" ADD CONSTRAINT "spin_history_bet_amount_check" CHECK (bet_amount > 0);

ALTER TABLE "spin_history" ADD CONSTRAINT "spin_history_payout_amount_check" CHECK (payout_amount >= 0);

ALTER TABLE "spin_history" ADD CONSTRAINT "spin_history_balance_check" CHECK (balance_after = balance_before + net_amount);

ALTER TABLE "spin_history" ADD CONSTRAINT "spin_history_symbols_check" CHECK (
    reel1_symbol IN ('cherry', 'lemon', 'apple', 'banana') AND
    reel2_symbol IN ('cherry', 'lemon', 'apple', 'banana') AND
    reel3_symbol IN ('cherry', 'lemon', 'apple', 'banana')
);
